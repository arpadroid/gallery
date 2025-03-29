/**
 * @typedef {import('./galleryDragControl.types').GalleryDragConfigType} GalleryDragConfigType
 * @typedef {import('../../gallery/gallery').default} Gallery
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */
import { defineCustomElement, listen } from '@arpadroid/tools';
import { ArpaElement } from '@arpadroid/ui';

class GalleryDragControl extends ArpaElement {
    deltaX = 0;
    startX = 0;
    _initialize() {
        this.bind('_onTouchStart', '_onTouchMove', '_onTouchEnd');
    }

    /**
     * Returns the default configuration for the gallery control.
     * @returns {GalleryDragConfigType} The default configuration.
     */ // @ts-ignore
    getDefaultConfig() {
        /** @type {Gallery | null} */
        this.gallery = this.closest('arpa-gallery');
        /** @type {ListResource} */
        this.resource = this.gallery?.listResource;
        return {
            swipeThreshold: this.gallery?.getProperty('swipe-threshold') || 100
        };
    }

    _onConnected() {
        super._onConnected();
    }

    async _onComplete() {
        await this.gallery?.promise;
        this._initializeEventListeners();
        this.remove();
        const canvas = this.getCanvas();
        canvas && (canvas.style.cursor = 'grab');
    }

    getCanvas() {
        return this.gallery?.viewNode;
    }

    _initializeEventListeners() {
        const canvas = this.getCanvas();
        if (!canvas) return;
        listen(canvas, ['mousedown', 'touchstart'], this._onTouchStart, { passive: false });
        listen(canvas, ['mouseup', 'touchend'], this._onTouchEnd, { passive: false });
        listen(canvas, 'click', event => event.preventDefault());
    }

    /**
     * Called when the user starts to drag the item.
     * @param {TouchEvent | MouseEvent | Event} event
     */
    _onTouchStart(event) {
        const canvas = this.getCanvas();
        if (!canvas) return;
        event.preventDefault();
        this.startX =
            'touches' in event ? event.touches[0].clientX : (event instanceof MouseEvent && event?.clientX) || 0;
        this.currentX = this.startX; // @ts-ignore
        listen(canvas, ['touchmove', 'mousemove'], this._onTouchMove, { passive: false });
    }

    /**
     * Called when the user moves the item.
     * @param {TouchEvent | MouseEvent} event
     */
    _onTouchMove(event) {
        if (this.gallery?.listResource?.getTotalItems() < 2) return;
        const canvas = this.getCanvas();
        if (!canvas || !this.startX) return;
        event.preventDefault();
        this.currentX =
            event instanceof TouchEvent && event?.touches
                ? event?.touches[0].clientX
                : event instanceof MouseEvent && event?.clientX;
        this.deltaX = Number(this.currentX) - this.startX;
        const item = this.gallery?.getCurrentItem();
        item instanceof HTMLElement && (item.style.transform = `translateX(${this.deltaX}px)`);
        const threshold = this.getProperty('swipe-threshold');
        const shouldSlideLeft = this.deltaX < -threshold;
        const shouldSlideRight = this.deltaX > threshold;
        if (shouldSlideLeft || shouldSlideRight) {
            canvas.removeEventListener('touchmove', this._onTouchMove);
            canvas.removeEventListener('mousemove', this._onTouchMove);
            shouldSlideLeft ? this.animateSwipe(-1) : this.animateSwipe(1);
        }
    }

    /**
     * Called when the user stops dragging the item.
     * @param {TouchEvent | MouseEvent | Event} event
     */
    _onTouchEnd(event) {
        const canvas = this.getCanvas();
        if (!canvas) return;
        event.preventDefault();
        canvas.removeEventListener('touchmove', this._onTouchMove);
        canvas.removeEventListener('mousemove', this._onTouchMove);
        const item = this.gallery?.getCurrentItem();
        if (item instanceof HTMLElement) {
            item.style.transition = 'transform .3s ease-out 0s';
            requestAnimationFrame(() => {
                item.style.transform = 'translateX(0px)';
            });
        }
    }

    /**
     * Animates the swipe.
     * @param {number} direction
     */
    animateSwipe(direction) {
        const canvas = this.gallery?.viewNode;
        const currentItem = /** @type {HTMLElement | null} */ (this.gallery?.getCurrentItem());
        if (!canvas || !currentItem) return;

        currentItem.style.transition = 'transform 2s ease-out 0s';
        requestAnimationFrame(() => {
            currentItem.style.transform = `translateX(${direction * 500}%)`;
            if (direction === -1) {
                this.gallery?.listResource?.nextPage();
            } else {
                this.gallery?.listResource?.previousPage();
            }
        });

        setTimeout(() => {
            currentItem.style.transition = '';
            currentItem.style.transform = '';
        }, 500);
    }
}

defineCustomElement('gallery-drag', GalleryDragControl);

export default GalleryDragControl;
