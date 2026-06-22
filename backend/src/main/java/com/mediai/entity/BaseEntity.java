package com.mediai.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@EntityListeners(BaseEntity.EntityTimestampListener.class)
@Getter
@Setter
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Version
    private Long version;

    @Column(nullable = false)
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public static class EntityTimestampListener {

        @PrePersist
        void prePersist(BaseEntity entity) {
            var now = Instant.now();
            entity.createdAt = now;
            entity.updatedAt = now;
            if (entity.deleted == null) {
                entity.deleted = false;
            }
        }

        @PreUpdate
        void preUpdate(BaseEntity entity) {
            entity.updatedAt = Instant.now();
        }
    }
}

