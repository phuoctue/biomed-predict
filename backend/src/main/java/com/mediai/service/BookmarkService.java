package com.mediai.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.common.PageResponse;
import com.mediai.dto.drug.DrugSummaryResponse;
import com.mediai.entity.Bookmark;
import com.mediai.entity.Drug;
import com.mediai.entity.User;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.BookmarkRepository;
import com.mediai.repository.DrugRepository;
import com.mediai.repository.UserRepository;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final DrugRepository drugRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository, UserRepository userRepository,
            DrugRepository drugRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
        this.drugRepository = drugRepository;
    }

    @Transactional
    public DrugSummaryResponse addBookmark(UUID userId, UUID drugId) {
        if (bookmarkRepository.existsByUserIdAndDrugId(userId, drugId)) {
            throw new IllegalStateException("Drug already bookmarked.");
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        var drug = drugRepository.findById(drugId)
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found."));

        var bookmark = new Bookmark(user, drug);
        bookmarkRepository.save(bookmark);

        return DrugSummaryResponse.from(drug);
    }

    @Transactional
    public void removeBookmark(UUID userId, UUID drugId) {
        bookmarkRepository.deleteByUserIdAndDrugId(userId, drugId);
    }

    @Transactional(readOnly = true)
    public Page<DrugSummaryResponse> getBookmarks(UUID userId, Pageable pageable) {
        return bookmarkRepository.findByUserId(userId, pageable)
                .map(b -> DrugSummaryResponse.from(b.getDrug()));
    }

    @Transactional(readOnly = true)
    public boolean isBookmarked(UUID userId, UUID drugId) {
        return bookmarkRepository.existsByUserIdAndDrugId(userId, drugId);
    }
}
