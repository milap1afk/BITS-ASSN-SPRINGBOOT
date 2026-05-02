package com.sbits.library.repository;

import com.sbits.library.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Author entity.
 * Extends JpaRepository for standard CRUD operations.
 */
@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    /**
     * Find authors by nationality.
     */
    List<Author> findByNationality(String nationality);

    /**
     * Find author by email.
     */
    Author findByEmail(String email);

    /**
     * Custom query: Inner join between Author and Book.
     * Returns authors who have at least one book, along with book details.
     */
    @Query("SELECT a, b FROM Author a INNER JOIN a.books b ORDER BY a.name")
    List<Object[]> findAuthorsWithBooks();
}
