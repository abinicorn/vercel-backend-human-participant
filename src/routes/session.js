import express from 'express';
import SessionDao from '../database/session/dao/SessionDao.js';
import ParticipantDao from '../database/participant/dao/ParticipantDao.js';

const router = express.Router();
const log4js = require('../utils/log4js.js');

import { HTTP_SUCCESS,
    HTTP_NOT_FOUND,
    HTTP_SERVER_ERROR,
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_NO_CONTENT,
    HTTP_LOGIN_ERROR} from "../enum.js";

// Retrieve all sessions by studyId
router.get('/list/:studyId', async (req, res) => {
    
    const { studyId } = req.params;

    try {
        const session = await SessionDao.retrieveSessionByStudyId(studyId);
        if (session) {
            res.status(HTTP_SUCCESS).json(session);
            log4js.info(`Session.router.get./list/:studyId. StudyId:${studyId}, Session list amount: ${session.length}`)
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'Sessions not found'});
            log4js.warn(`Session.router.get./list/:studyId doesn't find session data from StudyId ${studyId}`);
        }
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({message: "An error occurred", error});
        log4js.error(`Session.router.get./list/:studyId. Internal server error: ${error}`);
    }
    
});

// Edit session button: display the session's info
router.get('/:sessionId', async (req, res) => {
    
    const { sessionId } = req.params;

    try {
        const session = await SessionDao.retrieveSessionById(sessionId);
        if (session) {
            res.status(HTTP_SUCCESS).json(session);
            log4js.info(`Session.router.get./:sessionId. SessionId:${sessionId}`)
        } else {
            res.status(HTTP_NOT_FOUND).json({message: 'Session not found'});
            log4js.warn(`Session.router.get./:sessionId doesn't find session data from sessionId ${sessionId}`);
        }
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({message: "An error occurred", error});
        log4js.error(`Session.router.get./:sessionId. Internal server error: ${error}`);
    }
    
});

// View participant list button: display session’s participants’ list
router.get('/participant/list/:sessionId', async (req, res) => {
    
    try {
        
        const { sessionId } = req.params;
        const session = await SessionDao.retrieveSessionById(sessionId);
        const participantList = session.participantList;
        let participantListInfo = [];

        for (let index = 0; index < participantList.length; index++) {
            const participantInfo = await ParticipantDao.getParticipantById(participantList[index]);
            if (!participantInfo) {
                log4js.warn(`Participant with ID ${studyParticipant.participantId} not found.`);
                return null;
            } else {
                participantListInfo.push(participantInfo);
            }
        }

        if (participantListInfo) {
            res.status(HTTP_SUCCESS).json(participantListInfo);
            log4js.info(`Session.router.get./participant/list/:sessionId. SessionId:${sessionId}, Participant list amount: ${participantListInfo.length}`)
        }
        else {
            res.status(HTTP_NOT_FOUND).json({message: 'Participant list not found'});
            log4js.warn(`Session.router.get./participant/list/:sessionId doesn't find participant data from sessionId ${sessionId}`);
        }

    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({message: "An error occurred", error});
        log4js.error(`Session.router.get./participant/list/:sessionId. Internal server error: ${error}`);
    }

});

// Create a new session 
router.post('/:studyId', async (req, res) => {
    
    const { studyId } = req.params;
    const session = req.body;
    session.studyId = studyId;

    try {
        const newSession = await SessionDao.createSession(session);
        res.status(HTTP_CREATED).json(newSession);
        log4js.info(`Session.router.post./:studyId. StudyId: ${newSession.studyId} newSessionId: ${newSession._id} created`)
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({message: "An error occurred", error});
        log4js.error(`Session.router.post./:studyId. Internal server error: ${error}`);
    }
    
})

// Edit a session
router.put('/:sessionId', async (req, res) => {
    
    const { sessionId } = req.params
    const updateData = req.body;
    
    try {
        const success = await SessionDao.updateSession(sessionId, updateData);
        res.status(success ? HTTP_NO_CONTENT : HTTP_NOT_FOUND);
        if(success) {
            log4js.info(`Session.router.put./:sessionId. SessionId: ${sessionId} updated`)
        } else {
            log4js.warn(`Session.router.put./:sessionId. SessionId: ${sessionId} unsuccessful update`)
        }

    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({message: "An error occurred", error});
        log4js.error(`Session.router.put./:sessionId. Internal server error: ${error}`);
    }

});

// Delete session button
router.delete('/:sessionId', async (req, res) => {
    
    const { sessionId } = req.params;
    
    try {
        const success = await SessionDao.deleteSession(sessionId);
        res.status(success ? HTTP_NO_CONTENT : HTTP_NOT_FOUND).json(success);
        if(success) {
            log4js.info(`Session.router.delete./:sessionId. SessionId: ${sessionId} deleted`)
        } else {
            log4js.warn(`Session.router.delete./:sessionId. SessionId: ${sessionId} unsuccessful delete`)
        }
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({message: "An error occurred", error});
        log4js.error(`Session.router.delete./:sessionId. Internal server error: ${error}`);
    }
    
});

export default router;