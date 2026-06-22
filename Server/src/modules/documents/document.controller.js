const fs = require('fs');
const mongoose = require('mongoose');
const documentService = require('./document.service');
const Document = require('./document.model');
const { ok, fail } = require('../../utils/response');
const { recordAudit } = require('../security-audit/auditLog.service');

async function getDocuments(req, res, next) {
  try {
    const documents = await documentService.getDocumentsForUser(req.user);
    
    return ok(res, { documents }, 'Documents retrieved successfully', 200, req);
  } catch (error) {
    next(error);
  }
}

async function uploadDocument(req, res, next) {
  try {
    if (!req.file) return fail(res, 400, 'VALIDATION_FAILED', 'File is required');
    const { ownerType, ownerId, accessLevel } = req.body;
    if (!ownerType) {
      fs.unlinkSync(req.file.path);
      return fail(res, 400, 'VALIDATION_FAILED', 'ownerType is required');
    }

    if (ownerType !== 'PUBLIC') {
      if (!ownerId) {
        fs.unlinkSync(req.file.path);
        return fail(res, 400, 'VALIDATION_FAILED', 'ownerId is required for this ownerType');
      }
      if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        fs.unlinkSync(req.file.path);
        return fail(res, 400, 'VALIDATION_FAILED', 'ownerId must be a valid ObjectId');
      }
    } else if (accessLevel !== 'PUBLIC') {
      fs.unlinkSync(req.file.path);
      return fail(res, 400, 'VALIDATION_FAILED', 'PUBLIC ownerType must use PUBLIC accessLevel');
    }

    const doc = await documentService.uploadDoc({
      ownerType,
      ownerId,
      accessLevel,
      file: req.file,
      user: req.user
    });

    return ok(res, { document: doc }, 'Document uploaded successfully', 201, req);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    if (error.message.includes('BLOCKED_FILE_TYPE')) {
      return fail(res, 400, 'VALIDATION_FAILED', error.message);
    }
    if (error.message.includes('LIMIT_FILE_SIZE')) {
      return fail(res, 400, 'VALIDATION_FAILED', error.message);
    }
    next(error);
  }
}

async function getDocumentDetails(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || doc.isDeleted) return fail(res, 404, 'VALIDATION_FAILED', 'Document not found');

    const allowed = await documentService.checkAccess(req.user, doc);
    if (!allowed) {
      await recordAudit({
        actorId: req.user._id,
        actionType: 'UNAUTHORIZED_VIEW',
        entityType: 'DOCUMENT',
        entityId: doc._id.toString(),
        severity: 'HIGH',
        ipAddress: req.ip,
        metadata: { action: 'view_details' }
      });
      return fail(res, 403, 'OWNERSHIP_FORBIDDEN', 'Access denied: Unauthorized to view this document details');
    }

    await recordAudit({
      actorId: req.user._id,
      actionType: 'DOCUMENT_VIEWED',
      entityType: 'DOCUMENT',
      entityId: doc._id.toString(),
      severity: 'LOW',
      ipAddress: req.ip,
      metadata: { fileName: doc.fileName }
    });

    return ok(res, { document: doc }, 'Document details retrieved', 200, req);
  } catch (error) {
    next(error);
  }
}

async function downloadDoc(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || doc.isDeleted) return fail(res, 404, 'VALIDATION_FAILED', 'Document not found');
    if (!fs.existsSync(doc.storagePath)) return fail(res, 404, 'VALIDATION_FAILED', 'Physical file missing on server');

    const allowed = await documentService.checkAccess(req.user, doc);
    if (!allowed) {
      await recordAudit({
        actorId: req.user._id,
        actionType: 'UNAUTHORIZED_VIEW',
        entityType: 'DOCUMENT',
        entityId: doc._id.toString(),
        severity: 'HIGH',
        ipAddress: req.ip,
        metadata: { action: 'download_file' }
      });
      return fail(res, 403, 'OWNERSHIP_FORBIDDEN', 'Access denied: Unauthorized to download this document');
    }

    await recordAudit({
      actorId: req.user._id,
      actionType: 'DOCUMENT_DOWNLOADED',
      entityType: 'DOCUMENT',
      entityId: doc._id.toString(),
      severity: 'LOW',
      ipAddress: req.ip,
      metadata: { fileName: doc.fileName }
    });

    return res.download(doc.storagePath, doc.fileName);
  } catch (error) {
    next(error);
  }
}


async function changeAccessLevel(req, res, next) {
  try {
    const { accessLevel } = req.body;
    if (!accessLevel) return fail(res, 400, 'VALIDATION_FAILED', 'accessLevel is required');

    
    const originalDoc = await Document.findById(req.params.id);
    if (!originalDoc || originalDoc.isDeleted) {
      return fail(res, 404, 'VALIDATION_FAILED', 'Document not found');
    }

    
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      { accessLevel },
      { new: true, runValidators: true }
    );

    
    await recordAudit({
      actorId: req.user._id,
      actionType: 'DOCUMENT_ACCESS_UPDATED',
      entityType: 'DOCUMENT',
      entityId: updatedDoc._id.toString(),
      severity: 'MEDIUM',
      ipAddress: req.ip,
      metadata: {
        fileName: updatedDoc.fileName,
        oldLevel: originalDoc.accessLevel,
        newLevel: accessLevel
      }
    });

    
    return ok(res, { success: true, document: updatedDoc }, 'Access level updated successfully', 200, req);
  } catch (error) {
    next(error);
  }
}

async function deleteDocument(req, res, next) {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!doc) return fail(res, 404, 'VALIDATION_FAILED', 'Document not found');

    await recordAudit({
      actorId: req.user._id,
      actionType: 'DOCUMENT_SOFT_DELETED',
      entityType: 'DOCUMENT',
      entityId: doc._id.toString(),
      severity: 'MEDIUM',
      ipAddress: req.ip,
      metadata: { fileName: doc.fileName }
    });

    return ok(res, { document: doc }, 'Document soft deleted successfully', 200, req);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDocuments,
  uploadDocument,
  getDocumentDetails,
  downloadDoc,
  changeAccessLevel,
  deleteDocument
};