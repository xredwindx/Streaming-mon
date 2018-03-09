package com.solbox.web.util;

import com.samskivert.mustache.Mustache;
import com.samskivert.mustache.Mustache.Compiler;
import com.samskivert.mustache.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.io.IOException;
import java.io.Writer;

/**
 * Created by ??? on 2017-10-11.
 */
@ControllerAdvice
class LayoutAdvice {
    private final Mustache.Compiler compiler;

    @Autowired
    public LayoutAdvice(Compiler compiler) {
        this.compiler = compiler;
    }

    @ModelAttribute("layout")
    public Mustache.Lambda layout() {
        return new Layout(compiler);
    }
}

class Layout implements Mustache.Lambda {
    private Compiler compiler;
    String body = "";

    public Layout(Compiler compiler) {
        this.compiler = compiler;
    }

    @Override
    public void execute(Template.Fragment frag, Writer out) throws IOException {
        body = frag.execute();
        compiler.compile("{{>layout/layout}}").execute(frag.context(), out);
    }
}
