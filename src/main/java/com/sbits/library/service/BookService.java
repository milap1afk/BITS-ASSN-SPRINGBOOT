package com.sbits.library.service;

import com.sbits.library.entity.Author;
import com.sbits.library.entity.Book;
import com.sbits.library.repository.AuthorRepository;
import com.sbits.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Book entity.
 * Handles business logic and integrates with the repository layer.
 */
@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    @Autowired
    public BookService(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    /**
     * Get all books.
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /**
     * Get book by ID.
     */
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    /**
     * Save a new book. Throws exception on integrity violation (e.g., duplicate ISBN).
     */
    public Book saveBook(Book book, Long authorId) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + authorId));
        book.setAuthor(author);
        try {
            return bookRepository.save(book);
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException(
                "A book with this ISBN already exists: " + book.getIsbn());
        }
    }

    /**
     * Update an existing book.
     */
    public Book updateBook(Long id, Book updatedBook, Long authorId) {
        Book existing = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + authorId));
        existing.setTitle(updatedBook.getTitle());
        existing.setIsbn(updatedBook.getIsbn());
        existing.setGenre(updatedBook.getGenre());
        existing.setPrice(updatedBook.getPrice());
        existing.setAuthor(author);
        try {
            return bookRepository.save(existing);
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException(
                "A book with this ISBN already exists: " + updatedBook.getIsbn());
        }
    }

    /**
     * Custom query: Get books with their authors (inner join).
     */
    public List<Object[]> getBooksWithAuthors() {
        return bookRepository.findBooksWithAuthors();
    }
}
