package com.solbox.api.controller;

import com.solbox.api.service.AlertService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2018-02-07.
 */
@RestController
public class AlertController {
    private static Logger log = LoggerFactory.getLogger(AlertController.class);
    @Autowired private AlertService alertService;

    @RequestMapping(value = "/api/alertList", method = RequestMethod.POST)
    public ResponseEntity<?> getAlertList(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        List<Map<String, Object>> alertList = null;
        int totalCount = 0;

        try {
            alertList = alertService.getAlertList(param);
            totalCount = alertService.alertTotalCount(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        Map<String, Object> returnValue = new HashMap<>();
        returnValue.put("alertList", alertList);
        returnValue.put("totalCount", totalCount);

        return new ResponseEntity<Object>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/telegramList", method = RequestMethod.POST)
    public ResponseEntity<?> getTelegramList(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        List<Map<String, Object>> telegramList = null;
        int totalCount = 0;

        try {
            telegramList = alertService.getTelegramList(param);
            totalCount = alertService.telegramTotalCount(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        Map<String, Object> returnValue = new HashMap<>();
        returnValue.put("telegramList", telegramList);
        returnValue.put("totalCount", totalCount);

        return new ResponseEntity<Object>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/telegram/add", method = RequestMethod.POST)
    public ResponseEntity<?> addTelegram(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int returnValue = 0;

        try {
            returnValue = alertService.addTelegram(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Object>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/telegram/del", method = RequestMethod.POST)
    public ResponseEntity<?> delTelegram(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int returnValue = 0;

        try {
            returnValue = alertService.delTelegram(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Object>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/telegram/edit", method = RequestMethod.POST)
    public ResponseEntity<?> editTelegram(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int returnValue = 0;

        try {
            returnValue = alertService.editTelegram(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Object>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/telegram/get", method = RequestMethod.POST)
    public ResponseEntity<?> getTelegram(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        Map<String, Object> alertMap = null;

        try {
            alertMap = alertService.getTelegram(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Object>(alertMap, apiStatus);
    }

    @RequestMapping(value = "/api/alert/add", method = RequestMethod.POST)
    public ResponseEntity<?> addAlert(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int returnValue = 0;

        try {
            returnValue = alertService.addAlert(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Object>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/alert/del", method = RequestMethod.POST)
    public ResponseEntity<?> delAlert(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int returnValue = 0;

        try {
            returnValue = alertService.delAlert(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Object>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/alert/edit", method = RequestMethod.POST)
    public ResponseEntity<?> editAlert(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int returnValue = 0;

        try {
            returnValue = alertService.editAlert(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Object>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/alert/get", method = RequestMethod.POST)
    public ResponseEntity<?> getAlert(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        Map<String, Object> alertMap = null;

        try {
            alertMap = alertService.getStreamingAlert(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Object>(alertMap, apiStatus);
    }
}
