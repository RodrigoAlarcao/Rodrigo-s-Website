"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { sendContact } from "@/lib/actions";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // ── Entrance ─────────────────────────────────────────────────────────────
      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      const els = contentRef.current?.querySelectorAll("[data-animate]");
      if (els) {
        gsap.from(Array.from(els), {
          y: 40,
          opacity: 0,
          scale: 0.82,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      }

      // ── Exit (scrub as section scrolls past viewport top) ────────────────────
      const exitEls = contentRef.current?.querySelectorAll("[data-animate]");
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      exitTl
        .to(dividerRef.current, {
          scaleX: 0,
          transformOrigin: "right",
          opacity: 0,
          ease: "none",
        })
        .to(
          exitEls ? Array.from(exitEls) : [],
          {
            y: -40,
            opacity: 0,
            scale: 0.78,
            stagger: { each: 0.08, from: "start" },
            ease: "none",
          },
          "<"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const result = await sendContact(data);
      if (result.success) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Algo correu mal. Tenta novamente.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Erro de ligação. Tenta novamente.");
    }
  };

  const inputClass =
    "w-full bg-transparent border-0 py-4 font-body font-light text-text placeholder:text-dim outline-none resize-none";

  return (
    <section ref={sectionRef} id="contacto">
      <div className="container-site py-24 md:py-32">

        {/* Label de secção */}
        <div className="flex items-center gap-6 mb-16 md:mb-20">
          <p className="font-mono text-label uppercase tracking-[0.12em] text-dim whitespace-nowrap">
            Contacto
          </p>
          <div ref={dividerRef} className="flex-1 border-t border-border" />
        </div>

        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

          {/* Esquerda — título */}
          <div className="flex flex-col gap-4">
            <h2 data-animate className="font-display font-bold text-text leading-[1.05] tracking-tight text-[clamp(2.5rem,5vw,4rem)]">
              Tens um projecto
              <br />
              em mente?
            </h2>
            <p data-animate className="text-hero-tagline font-body font-light italic text-dim leading-[1.4]">
              Fala comigo.
            </p>
            <p data-animate className="font-body font-light text-dim leading-[1.75] mt-4 max-w-sm">
              Ou escreve directamente para{" "}
              <a
                href="mailto:alarcao.rodrigo@gmail.com"
                className="text-text hover:text-accent transition-colors duration-300"
              >
                alarcao.rodrigo@gmail.com
              </a>
            </p>
          </div>

          {/* Direita — formulário */}
          <div data-animate>
            {status === "success" ? (
              <div className="flex flex-col gap-4 py-8">
                <p className="font-display font-bold text-text text-[1.5rem]">
                  Mensagem enviada.
                </p>
                <p className="font-body font-light text-dim leading-[1.75]">
                  Respondo em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>

                {/* Nome */}
                <div className="flex flex-col gap-1">
                  <div className="input-wrapper">
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Nome"
                      className={inputClass}
                      disabled={status === "loading"}
                    />
                  </div>
                  {errors.name && (
                    <p className="font-mono text-label text-accent">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <div className="input-wrapper">
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Email"
                      className={inputClass}
                      disabled={status === "loading"}
                    />
                  </div>
                  {errors.email && (
                    <p className="font-mono text-label text-accent">{errors.email.message}</p>
                  )}
                </div>

                {/* Mensagem */}
                <div className="flex flex-col gap-1">
                  <div className="input-wrapper">
                    <textarea
                      {...register("message")}
                      placeholder="Mensagem"
                      rows={4}
                      className={inputClass}
                      disabled={status === "loading"}
                    />
                  </div>
                  {errors.message && (
                    <p className="font-mono text-label text-accent">{errors.message.message}</p>
                  )}
                </div>

                {/* Erro global */}
                {status === "error" && (
                  <p className="font-mono text-label text-accent">{errorMsg}</p>
                )}

                {/* Submit */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex items-center gap-2 font-display font-medium text-[1.125rem] text-text hover:text-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{status === "loading" ? "A enviar..." : "Enviar"}</span>
                    {status !== "loading" && (
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
