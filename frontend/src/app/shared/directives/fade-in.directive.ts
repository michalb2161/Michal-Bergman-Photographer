import { Directive, ElementRef, inject, input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFadeIn]',
  standalone: true
})
export class FadeInDirective implements OnInit, OnDestroy {
  readonly appFadeInDelay = input(0);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(18px)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 0.9s ease, transform 0.9s ease');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = this.appFadeInDelay();
            setTimeout(() => {
              this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
              this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
            }, delay);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
