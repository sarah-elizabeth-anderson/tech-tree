// Import dependencies
import pipelines from './data.js';
import { getUrlParam, createElement, redirectTo } from './utils.js';

// DOM Elements
const elements = {
    // Mobile elements
    mobileTitle: document.getElementById('pipeline-title-mobile'),
    mobileImage: document.getElementById('pipeline-image-mobile'),
    mobileDescription: document.getElementById('pipeline-description-mobile'),
    
    // Desktop elements
    desktopTitle: document.getElementById('pipeline-title-desktop'),
    desktopImage: document.getElementById('pipeline-image-desktop'),
    desktopDescription: document.getElementById('pipeline-description-desktop'),
    
    // Common elements
    content: document.querySelector('.pipeline-content')
};

/**
 * Initialize the pipeline page
 */
function init() {
    const pipelineName = getUrlParam('name');
    
    if (!pipelineName) {
        redirectTo('index.html');
        return;
    }
    
    const pipeline = pipelines.find(p => p.name === pipelineName);
    
    if (!pipeline) {
        redirectTo('index.html');
        return;
    }
    
    updatePageContent(pipeline);
    renderIdeas(pipeline);
}

/**
 * Update the page title, description, and image for both mobile and desktop
 * @param {Object} pipeline - The pipeline data
 */
function updatePageContent(pipeline) {
    // Update document title
    document.title = `Tech Tree - ${pipeline.name}`;
    
    // Update mobile header
    if (elements.mobileTitle) elements.mobileTitle.textContent = pipeline.name;
    if (elements.mobileDescription) {
        elements.mobileDescription.textContent = pipeline.description || '';
        elements.mobileDescription.style.display = pipeline.description ? 'block' : 'none';
    }
    if (elements.mobileImage && pipeline.image) {
        elements.mobileImage.src = pipeline.image;
        elements.mobileImage.alt = pipeline.name;
    }
    
    // Update desktop header
    if (elements.desktopTitle) elements.desktopTitle.textContent = pipeline.name;
    if (elements.desktopDescription) {
        elements.desktopDescription.textContent = pipeline.description || '';
        elements.desktopDescription.style.display = pipeline.description ? 'block' : 'none';
    }
    if (elements.desktopImage && pipeline.image) {
        elements.desktopImage.src = pipeline.image;
        elements.desktopImage.alt = pipeline.name;
    }
    
    if (elements.image) {
        if (pipeline.image) {
            elements.image.src = pipeline.image;
            elements.image.alt = `${pipeline.name} image`;
            elements.image.style.display = 'block';
        } else {
            elements.image.style.display = 'none';
        }
    }
}

/**
 * Render the ideas grid for the pipeline
 * @param {Object} pipeline - The pipeline data
 */
function renderIdeas(pipeline) {
    if (!elements.content) return;
    
    elements.content.innerHTML = '';
    
    const hasIdeas = Object.entries(pipeline.ideas).some(([_, ideas]) => ideas && ideas.length > 0);
    
    if (!hasIdeas) {
        elements.content.appendChild(
            createElement('p', {}, 'No ideas available for this pipeline.')
        );
        return;
    }
    
    Object.entries(pipeline.ideas).forEach(([techLevel, ideas]) => {
        if (!ideas || ideas.length === 0) return;
        
        const section = createElement('div', { class: 'tech-level-section' }, [
            createElement('h2', {}, `Tech Level ${techLevel}`),
            createElement('div', { class: 'ideas-grid' },
                ideas.map(idea => createIdeaCard(idea, pipeline.name))
            )
        ]);
        
        elements.content.appendChild(section);
    });
}

/**
 * Create an idea card element
 * @param {Object} idea - The idea data
 * @param {string} pipelineName - The name of the parent pipeline
 * @returns {HTMLElement} The created card element
 */
function createIdeaCard(idea, pipelineName) {
    const card = createElement('a', {
        class: 'idea-card',
        href: `idea.html?pipeline=${encodeURIComponent(pipelineName)}&idea=${encodeURIComponent(idea.name)}`
    });
    
    if (idea.image) {
        card.appendChild(
            createElement('img', {
                class: 'idea-image',
                src: idea.image,
                alt: idea.name
            })
        );
    }
    
    card.appendChild(createElement('h3', {}, idea.name));
    return card;
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
