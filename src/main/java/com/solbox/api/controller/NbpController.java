package com.solbox.api.controller;

import com.solbox.api.service.NbpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2018-01-10.
 */
@RestController
public class NbpController {
    private static Logger log = LoggerFactory.getLogger(NbpController.class);
    @Autowired private NbpService nbpService;

    @RequestMapping(value = "/api/nbp", method = RequestMethod.POST)
    public ResponseEntity<?> getNbpList(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        List<Map<String, Object>> nbpList = null;

        try {
            nbpList = nbpService.getNbpList(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(nbpList, apiStatus);
    }
}
