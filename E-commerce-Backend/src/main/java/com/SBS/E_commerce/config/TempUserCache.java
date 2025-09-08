package com.SBS.E_commerce.config;

import com.SBS.E_commerce.entity.User;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class TempUserCache {

    private final ConcurrentHashMap<String, User> tempUserMap = new ConcurrentHashMap<>();

    public void storeUser(String email, User user) {
        tempUserMap.put(email, user);
    }

    public User getUser(String email) {
        return tempUserMap.get(email);
    }

    public void removeUser(String email) {
        tempUserMap.remove(email);
    }

    public boolean contains(String email) {
        return tempUserMap.containsKey(email);
    }
}
