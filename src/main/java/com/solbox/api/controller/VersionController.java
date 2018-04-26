package com.solbox.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by ??? on 2018-04-26.
 */

@RestController
public class VersionController {
    @Value("${c_version}")
    private String version;

    @RequestMapping(value = "/version")
    public String version() {
        return version;
    }
}
