package com.mediai.specification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.mediai.entity.Drug;

public final class DrugSpecifications {

    private DrugSpecifications() {
    }

    public static Specification<Drug> keywordContains(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) {
                return cb.conjunction();
            }

            query.distinct(true);
            var pattern = "%" + keyword.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("code")), pattern),
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("genericName")), pattern),
                    cb.like(cb.lower(root.get("drugGroup")), pattern),
                    cb.like(cb.lower(root.get("dosageForm")), pattern),
                    cb.like(cb.lower(root.get("strength")), pattern),
                    cb.like(cb.lower(root.get("manufacturer")), pattern),
                    cb.like(cb.lower(root.get("status")), pattern));
        };
    }

    public static Specification<Drug> drugGroupEquals(String drugGroup) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(drugGroup)) {
                return cb.conjunction();
            }
            return cb.equal(cb.lower(root.get("drugGroup")), drugGroup.trim().toLowerCase());
        };
    }

    public static Specification<Drug> ingredientContains(String ingredient) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(ingredient)) {
                return cb.conjunction();
            }

            query.distinct(true);
            var ingredientJoin = root.join("drugIngredients").join("ingredient");
            return cb.like(cb.lower(ingredientJoin.get("name")), "%" + ingredient.trim().toLowerCase() + "%");
        };
    }
}
