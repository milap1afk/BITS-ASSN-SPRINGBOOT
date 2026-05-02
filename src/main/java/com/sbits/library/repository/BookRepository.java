package com.sbits.library.repository;

import com.sbits.library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Book entity.
 * Extends JpaRepository for standard CRUD operations.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * Find books by genre.
     */
    List<Book> findByGenre(String genre);

    /**
     * Find books by author id.
     */
    List<Book> findByAuthorId(Long authorId);

    /**
     * Custom query: Inner join between Book and Author.
     * Returns book details along with their author information.
     */
    @Query("SELECT b, a FROM Book b INNER JOIN b.author a ORDER BY b.title")
    List<Object[]> findBooksWithAuthors();
}
