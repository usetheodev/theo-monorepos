package com.theo.worker.task;

import com.theo.shared.AppInfo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class TickTask {

    private static final Logger logger = Logger.getLogger(TickTask.class.getName());

    @Scheduled(fixedDelay = 10000)
    public void tick() {
        logger.info("worker tick v" + AppInfo.VERSION);
    }
}
