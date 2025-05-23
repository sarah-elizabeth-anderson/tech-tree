// Import dependencies
import pipelines from './data.js';
import { initSmoothScrolling, initScrollAnimations, createElement } from './utils.js';

/**
 * Initialize the application
 */
function init() {
    initPipelines();
    initSmoothScrolling();
    initScrollAnimations();
}

/**
 * Initialize pipeline cards in the grid
 */
function initPipelines() {
    const pipelinesGrid = document.querySelector('.pipelines-grid');
    
    if (!pipelinesGrid) {
        return;
    }
    
    pipelinesGrid.innerHTML = ''; // Clear existing content
    
    pipelines.forEach(pipeline => {
        const card = createElement('a', {
            class: 'pipeline-card',
            href: `pipeline.html?name=${encodeURIComponent(pipeline.name)}`
        }, [
            createElement('div', { class: 'pipeline-card-image' }, [
                createElement('img', {
                    src: pipeline.image,
                    alt: pipeline.name,
                    onerror: "this.src='images/placeholder.jpg'"
                })
            ]),
            createElement('div', { class: 'pipeline-card-content' }, [
                createElement('h3', {}, pipeline.name)
            ])
        ]);
        
        pipelinesGrid.appendChild(card);
    });
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
