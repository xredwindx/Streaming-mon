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

import java.util.Base64;
import java.util.Map;

/**
 * Created by ??? on 2017-11-30.
 */
@RestController
public class UserController {
    private static Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired private UserService userService;

    @RequestMapping(value = "/api/checkUser", method = RequestMethod.POST)
    public ResponseEntity<?> checkUser(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        Map<String, Object> userInfo = null;

        try {
            // pwd base64 decode
            String pwdEn = (String) param.get("pwd");
            byte[] pwdBytes = Base64.getDecoder().decode(pwdEn);
            String pwd = new String(pwdBytes, "UTF-8");
            param.put("pwd", pwd);

            userInfo = userService.getUserInfo(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(userInfo, apiStatus);
    }

    @RequestMapping(value = "/api/pwdChange", method = RequestMethod.POST)
    public ResponseEntity<?> pwdChange(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int result = 0;

        try {
            result = userService.changePwd(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(result, apiStatus);
    }
}
