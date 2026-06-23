package com.mediai.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.drug.DrugSummaryResponse;
import com.mediai.entity.Bookmark;
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
    public DrugSummaryResponse addBookmark(Long userId, Long drugId) {
        if (bookmarkRepository.existsByUserIdAndDrugId(userId, drugId)) {
            throw new IllegalStateException("Drug already bookmarked.");
        }
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        var drug = drugRepository.findById(drugId)
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found."));

        bookmarkRepository.save(new Bookmark(user, drug));
        return DrugSummaryResponse.from(drug);
    }

    @Transactional
    public void removeBookmark(Long userId, Long drugId) {
        bookmarkRepository.deleteByUserIdAndDrugId(userId, drugId);
    }

    @Transactional(readOnly = true)
    public Page<DrugSummaryResponse> getBookmarks(Long userId, Pageable pageable) {
        return bookmarkRepository.findByUserId(userId, pageable)
                .map(b -> DrugSummaryResponse.from(b.getDrug()));
    }

    @Transactional(readOnly = true)
    public boolean isBookmarked(Long userId, Long drugId) {
        return bookmarkRepository.existsByUserIdAndDrugId(userId, drugId);
    }
}
