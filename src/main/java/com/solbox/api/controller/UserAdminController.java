package com.solbox.api.controller;

import com.solbox.api.service.UserService;
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
 * Created by ??? on 2018-01-04.
 */
@RestController
public class UserAdminController {
    private static Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired private UserService userService;

    @RequestMapping(value = "/api/userList", method = RequestMethod.POST)
    public ResponseEntity<?> userList(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        List<Map<String, Object>> userList = null;
        int totalCount = 0;

        try {
            userList = userService.getUserList(param);
            totalCount = userService.totalCount(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        Map<String, Object> returnValue = new HashMap<>();
        returnValue.put("userList", userList);
        returnValue.put("totalCount", totalCount);

        return new ResponseEntity<>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/checkUserId", method = RequestMethod.POST)
    public ResponseEntity<?> checkUserId(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int totalCount = 0;

        try {
            totalCount = userService.getChkUserId(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(totalCount, apiStatus);
    }

    @RequestMapping(value = "/api/addUser", method = RequestMethod.POST)
    public ResponseEntity<?> addUser(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int resultValue = 0;

        try {
            resultValue = userService.insertUser(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultValue, apiStatus);
    }

    @RequestMapping(value = "/api/pwdReset", method = RequestMethod.POST)
    public ResponseEntity<?> pwdReset(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int resultValue = 0;

        try {
            resultValue = userService.pwdReset(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultValue, apiStatus);
    }

    @RequestMapping(value = "/api/delUser", method = RequestMethod.POST)
    public ResponseEntity<?> delUser(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int resultValue = 0;

        try {
            resultValue = userService.deleteUser(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultValue, apiStatus);
    }

    @RequestMapping(value = "/api/getUser", method = RequestMethod.POST)
    public ResponseEntity<?> getUser(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        Map<String, Object> user = null;

        try {
            user = userService.getUser(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(user, apiStatus);
    }

    @RequestMapping(value = "/api/editUser", method = RequestMethod.POST)
    public ResponseEntity<?> editUser(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int resultValue = 0;

        try {
            resultValue = userService.updateUser(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultValue, apiStatus);
    }
}
