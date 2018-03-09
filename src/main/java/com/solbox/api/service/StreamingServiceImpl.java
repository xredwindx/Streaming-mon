package com.solbox.api.service;

import com.solbox.api.dao.StreamingDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2017-12-06.
 */
@Service
public class StreamingServiceImpl implements StreamingService {
    public static Logger log = LoggerFactory.getLogger(StreamingServiceImpl.class);
    @Autowired private StreamingDao streamingDao;

    @Override
    public int addStreaming(Map<String, Object> param) {
        return streamingDao.addStreaming(param);
    }

    @Override
    public List<Map<String, Object>> getStreamingList(Map<String, Object> param) {
        return streamingDao.getStreamingList(param);
    }

    @Override
    public List<Map<String, Object>> getStreamingHistoryList(Map<String, Object> param) {
        return streamingDao.getStreamingHistoryList(param);
    }

    @Override
    public int historyTotalCount(Map<String, Object> param) {
        return streamingDao.historyTotalCount(param);
    }

    @Override
    public int updateCheckedYN(Map<String, Object> param) {
        return streamingDao.updateCheckedYN(param);
    }

    @Override
    public int deleteStreaming(Map<String, Object> param) {
        return streamingDao.deleteStreaming(param);
    }

    @Override
    public int updateStreaming(Map<String, Object> param) {
        return streamingDao.updateStreaming(param);
    }

    @Override
    public int addStreamingHis(Map<String, Object> param) {
        return streamingDao.addStreamingHis(param);
    }

    @Override
    public Map<String, Object> getCheckStreaming(Map<String, Object> param) {
        return streamingDao.getCheckStreaming(param);
    }
}
