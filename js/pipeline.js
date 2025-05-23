// Import dependencies
import pipelines from './data.js';
import { getUrlParam, createElement, redirectTo } from './utils.js';

// DOM Elements
const elements = {
    title: document.getElementById('pipeline-title'),
    image: document.getElementById('pipeline-image'),
    content: document.querySelector('.pipeline-content'),
    description: document.getElementById('pipeline-description')
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
 * Update the page title, description, and image
 * @param {Object} pipeline - The pipeline data
 */
function updatePageContent(pipeline) {
    if (elements.title) {
        elements.title.textContent = pipeline.name;
        document.title = `Tech Tree - ${pipeline.name}`;
    }
    
    if (elements.description && pipeline.description) {
        elements.description.textContent = pipeline.description;
        elements.description.style.display = 'block';
    } else if (elements.description) {
        elements.description.style.display = 'none';
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
