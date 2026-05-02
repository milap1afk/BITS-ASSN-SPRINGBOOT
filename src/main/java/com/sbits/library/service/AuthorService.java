package com.sbits.library.service;

import com.sbits.library.entity.Author;
import com.sbits.library.repository.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Author entity.
 * Handles business logic and integrates with the repository layer.
 */
@Service
@Transactional
public class AuthorService {

    private final AuthorRepository authorRepository;

    @Autowired
    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    /**
     * Get all authors.
     */
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    /**
     * Get author by ID.
     */
    public Optional<Author> getAuthorById(Long id) {
        return authorRepository.findById(id);
    }

    /**
     * Save a new author. Throws exception on integrity violation (e.g., duplicate email).
     */
    public Author saveAuthor(Author author) {
        try {
            return authorRepository.save(author);
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException(
                "An author with this email already exists: " + author.getEmail());
        }
    }

    /**
     * Update an existing author.
     */
    public Author updateAuthor(Long id, Author updatedAuthor) {
        Author existing = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        existing.setName(updatedAuthor.getName());
        existing.setEmail(updatedAuthor.getEmail());
        existing.setNationality(updatedAuthor.getNationality());
        try {
            return authorRepository.save(existing);
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException(
                "An author with this email already exists: " + updatedAuthor.getEmail());
        }
    }

    /**
     * Custom query: Get authors with their books (inner join).
     */
    public List<Object[]> getAuthorsWithBooks() {
        return authorRepository.findAuthorsWithBooks();
    }
}
