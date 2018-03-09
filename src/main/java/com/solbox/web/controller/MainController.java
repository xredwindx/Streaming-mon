package com.solbox.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by ??? on 2017-11-21.
 */
@Controller
public class MainController {
    @RequestMapping("/")
    public String start() {
        return "redirect:login";
    }

    @RequestMapping("/login")
    public String login(HttpServletRequest req, Model model) {
        String errCode = req.getParameter("error");
        if(errCode == null) {
            errCode = "";
        }
        model.addAttribute("errCode", errCode);
        return "login";
    }

    @RequestMapping("/main")
    public String main() { return "main"; }

    @RequestMapping("/user/pwdChange")
    public String pwdChange() {
        return "user/pwdChange";
    }

    @RequestMapping("/user/admin")
    public String userAdmin() {
        return "user/admin";
    }

    @RequestMapping("/user/modalAddUser")
    public String modalAddUser() {
        return "user/modalAddUser";
    }

    @RequestMapping("/user/modalPwdReset")
    public String modalPwdReset() {
        return "user/modalPwdReset";
    }

    @RequestMapping("/user/modalDelUser")
    public String modalDelUser() {
        return "user/modalDelUser";
    }

    @RequestMapping("/user/modalEditUser")
    public String modalEditUser() {
        return "user/modalEditUser";
    }

    @RequestMapping("/nbp/dashboard")
    public String nbpDashboard() {
        return "nbp/dashboard";
    }

    @RequestMapping("/nbp/monitor")
    public String nbpMonitor() { return "nbp/monitor"; }

    @RequestMapping("/streaming/dashboard")
    public String streamingDashboard() {
        return "streaming/dashboard";
    }

    @RequestMapping("/streaming/history")
    public String streamingHistory() {
        return "streaming/history";
    }

    @RequestMapping("/streaming/modalPlay")
    public String modalPlay() {
        return "streaming/modalPlay";
    }

    @RequestMapping("/alert/config")
    public String alertConfig() {
        return "alert/config";
    }

    @RequestMapping("/alert/modalAddAlert")
    public String modalAddAlert() {
        return "alert/modalAddAlert";
    }

    @RequestMapping("/alert/modalDelAlert")
    public String modalDelAlert() {
        return "alert/modalDelAlert";
    }

    @RequestMapping("/alert/modalEditAlert")
    public String modalEditAlert() {
        return "alert/modalEditAlert";
    }

    @RequestMapping("/alert/modalAddTelegram")
    public String modalAddTelegram() {
        return "alert/modalAddTelegram";
    }

    @RequestMapping("/alert/modalDelTelegram")
    public String modalDelTelegram() {
        return "alert/modalDelTelegram";
    }

    @RequestMapping("/alert/modalEditTelegram")
    public String modalEditTelegram() {
        return "alert/modalEditTelegram";
    }
}
