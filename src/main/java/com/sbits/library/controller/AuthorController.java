package com.sbits.library.controller;

import com.sbits.library.entity.Author;
import com.sbits.library.service.AuthorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.validation.Valid;

/**
 * Spring MVC Controller for handling Author-related HTTP requests.
 */
@Controller
@RequestMapping("/authors")
public class AuthorController {

    private final AuthorService authorService;

    @Autowired
    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    /**
     * Display all authors (Read operation).
     */
    @GetMapping
    public String listAuthors(Model model) {
        model.addAttribute("authors", authorService.getAllAuthors());
        return "authors";
    }

    /**
     * Show form to add a new author (Create operation - form).
     */
    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("author", new Author());
        return "author-form";
    }

    /**
     * Handle form submission to save a new author (Create operation - save).
     * Handles integrity violations (e.g., duplicate email).
     */
    @PostMapping("/save")
    public String saveAuthor(@Valid @ModelAttribute("author") Author author,
                             BindingResult result,
                             RedirectAttributes redirectAttributes,
                             Model model) {
        if (result.hasErrors()) {
            return "author-form";
        }
        try {
            authorService.saveAuthor(author);
            redirectAttributes.addFlashAttribute("successMessage", "Author added successfully!");
            return "redirect:/authors";
        } catch (DataIntegrityViolationException ex) {
            model.addAttribute("errorMessage", ex.getMessage());
            return "author-form";
        }
    }

    /**
     * Show form to update an existing author (Update operation - form).
     */
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Author author = authorService.getAuthorById(id)
                .orElse(null);
        if (author == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Author not found with id: " + id);
            return "redirect:/authors";
        }
        model.addAttribute("author", author);
        return "author-update";
    }

    /**
     * Handle update submission (Update operation - save).
     */
    @PostMapping("/update/{id}")
    public String updateAuthor(@PathVariable Long id,
                               @Valid @ModelAttribute("author") Author author,
                               BindingResult result,
                               RedirectAttributes redirectAttributes,
                               Model model) {
        if (result.hasErrors()) {
            author.setId(id);
            return "author-update";
        }
        try {
            authorService.updateAuthor(id, author);
            redirectAttributes.addFlashAttribute("successMessage", "Author updated successfully!");
            return "redirect:/authors";
        } catch (DataIntegrityViolationException ex) {
            model.addAttribute("errorMessage", ex.getMessage());
            author.setId(id);
            return "author-update";
        }
    }
}
