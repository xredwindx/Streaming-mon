package com.solbox.api.service;

import com.solbox.api.dao.UserDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2017-11-30.
 */
@Service
public class UserServiceImpl implements UserService {
    private static Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired private UserDao userDao;

    @Override
    public Map<String, Object> getUserInfo(Map<String, Object> param) {
        return userDao.getUserInfo(param);
    }

    @Override
    public int changePwd(Map<String, Object> param) {
        return userDao.changePwd(param);
    }

    @Override
    public List<Map<String, Object>> getUserList(Map<String, Object> param) {
        return userDao.getUserList(param);
    }

    @Override
    public int totalCount(Map<String, Object> param) {
        return userDao.totalCount(param);
    }

    @Override
    public int getChkUserId(Map<String, Object> param) {
        return userDao.getChkUserId(param);
    }

    @Override
    public int insertUser(Map<String, Object> param) {
        return userDao.insertUser(param);
    }

    @Override
    public int pwdReset(Map<String, Object> param) {
        return userDao.pwdReset(param);
    }

    @Override
    public int deleteUser(Map<String, Object> param) {
        return userDao.deleteUser(param);
    }

    @Override
    public Map<String, Object> getUser(Map<String, Object> param) {
        return userDao.getUser(param);
    }

    @Override
    public int updateUser(Map<String, Object> param) {
        return userDao.updateUser(param);
    }
}
