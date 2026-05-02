package com.sbits.library.controller;

import com.sbits.library.entity.Author;
import com.sbits.library.entity.Book;
import com.sbits.library.service.AuthorService;
import com.sbits.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Spring MVC Controller for handling Book-related HTTP requests.
 */
@Controller
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;
    private final AuthorService authorService;

    @Autowired
    public BookController(BookService bookService, AuthorService authorService) {
        this.bookService = bookService;
        this.authorService = authorService;
    }

    /**
     * Display all books (Read operation).
     */
    @GetMapping
    public String listBooks(Model model) {
        model.addAttribute("books", bookService.getAllBooks());
        return "books";
    }

    /**
     * Show form to add a new book (Create operation - form).
     */
    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("book", new Book());
        model.addAttribute("authors", authorService.getAllAuthors());
        return "book-form";
    }

    /**
     * Handle form submission to save a new book (Create operation - save).
     * Handles integrity violations (e.g., duplicate ISBN).
     */
    @PostMapping("/save")
    public String saveBook(@Valid @ModelAttribute("book") Book book,
                           BindingResult result,
                           @RequestParam("authorId") Long authorId,
                           RedirectAttributes redirectAttributes,
                           Model model) {
        if (result.hasErrors()) {
            model.addAttribute("authors", authorService.getAllAuthors());
            return "book-form";
        }
        try {
            bookService.saveBook(book, authorId);
            redirectAttributes.addFlashAttribute("successMessage", "Book added successfully!");
            return "redirect:/books";
        } catch (DataIntegrityViolationException ex) {
            model.addAttribute("errorMessage", ex.getMessage());
            model.addAttribute("authors", authorService.getAllAuthors());
            return "book-form";
        }
    }

    /**
     * Show form to update an existing book (Update operation - form).
     */
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Book book = bookService.getBookById(id).orElse(null);
        if (book == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Book not found with id: " + id);
            return "redirect:/books";
        }
        model.addAttribute("book", book);
        model.addAttribute("authors", authorService.getAllAuthors());
        return "book-update";
    }

    /**
     * Handle update submission (Update operation - save).
     */
    @PostMapping("/update/{id}")
    public String updateBook(@PathVariable Long id,
                             @Valid @ModelAttribute("book") Book book,
                             BindingResult result,
                             @RequestParam("authorId") Long authorId,
                             RedirectAttributes redirectAttributes,
                             Model model) {
        if (result.hasErrors()) {
            book.setId(id);
            model.addAttribute("authors", authorService.getAllAuthors());
            return "book-update";
        }
        try {
            bookService.updateBook(id, book, authorId);
            redirectAttributes.addFlashAttribute("successMessage", "Book updated successfully!");
            return "redirect:/books";
        } catch (DataIntegrityViolationException ex) {
            model.addAttribute("errorMessage", ex.getMessage());
            book.setId(id);
            model.addAttribute("authors", authorService.getAllAuthors());
            return "book-update";
        }
    }

    /**
     * Display joined data from Author and Book tables (Inner Join query).
     */
    @GetMapping("/joined")
    public String showJoinedData(Model model) {
        List<Object[]> joinedData = bookService.getBooksWithAuthors();
        model.addAttribute("joinedData", joinedData);
        return "joined-data";
    }
}
