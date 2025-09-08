package com.SBS.E_commerce.config;

import com.SBS.E_commerce.dto.OrderResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisCacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        // Default cache config
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer())
                )
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues();

        // Per-cache TTLs
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("products", defaultConfig.entryTtl(Duration.ofHours(1)));
        cacheConfigs.put("allProducts", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        cacheConfigs.put("searchProducts", defaultConfig.entryTtl(Duration.ofMinutes(10)));
        cacheConfigs.put("categoryProducts", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigs.put("priceProducts", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigs.put("userCart", defaultConfig.entryTtl(Duration.ofMinutes(30)));

        // Custom serializer for userOrders (List<OrderResponseDTO>)
        ObjectMapper objectMapper = new ObjectMapper();

        CollectionType listType = objectMapper.getTypeFactory()
                .constructCollectionType(List.class, OrderResponseDTO.class);

        Jackson2JsonRedisSerializer<List<OrderResponseDTO>> userOrdersSerializer =
                new Jackson2JsonRedisSerializer<>(objectMapper, listType); // Modern constructor

        RedisCacheConfiguration userOrdersConfig = defaultConfig
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(userOrdersSerializer))
                .entryTtl(Duration.ofMinutes(30));

        cacheConfigs.put("userOrders", userOrdersConfig);

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);

        // String serializer for keys
        StringRedisSerializer stringSerializer = new StringRedisSerializer();

        // JSON serializer for values
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();

        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
