// Import dependencies
import pipelines from './data.js';
import { getUrlParam, createElement, redirectTo } from './utils.js';

// DOM Elements
const elements = {
    backButton: document.querySelector('.back-button'),
    ideaContent: document.querySelector('.idea-content'),
    recommendationsContainer: document.querySelector('.recommendations-container')
};

// State
let currentIdea = null;
let currentPipeline = null;
let currentTechLevel = null;

/**
 * Initialize the idea page
 */
function init() {
    const ideaName = getUrlParam('idea');
    const pipelineName = getUrlParam('pipeline');
    
    if (!ideaName) {
        redirectTo('index.html');
        return;
    }
    
    findIdea(ideaName, pipelineName);
    
    if (currentIdea) {
        updateBackButton();
        renderIdeaContent();
        renderRecommendations();
    } else {
        renderNotFound();
    }
}

/**
 * Find an idea by name in the specified pipeline or all pipelines
 * @param {string} ideaName - The name of the idea to find
 * @param {string} [pipelineName] - Optional pipeline name to search in
 */
function findIdea(ideaName, pipelineName) {
    const searchPipelines = pipelineName 
        ? [pipelines.find(p => p.name === pipelineName)] 
        : pipelines;
    
    for (const pipeline of searchPipelines) {
        if (!pipeline?.ideas) continue;
        
        for (const [level, ideas] of Object.entries(pipeline.ideas)) {
            const foundIdea = ideas.find(i => i.name === ideaName);
            if (foundIdea) {
                currentIdea = foundIdea;
                currentPipeline = pipeline;
                currentTechLevel = level;
                return;
            }
        }
    }
}

/**
 * Update the back button to return to the pipeline page or home
 */
function updateBackButton() {
    if (!elements.backButton) return;
    
    if (currentPipeline) {
        elements.backButton.href = `pipeline.html?name=${encodeURIComponent(currentPipeline.name)}`;
        elements.backButton.textContent = `← Back to ${currentPipeline.name}`;
    } else {
        elements.backButton.href = 'index.html';
        elements.backButton.textContent = '← Back to Home';
    }
}

/**
 * Render the main idea content
 */
function renderIdeaContent() {
    if (!elements.ideaContent || !currentIdea) return;
    
    elements.ideaContent.innerHTML = '';
    elements.ideaContent.appendChild(createIdeaElement());
    document.title = `Tech Tree - ${currentIdea.name}`;
}

/**
 * Create the idea element with all its content
 * @returns {HTMLElement} The created idea element
 */
function createIdeaElement() {
    return createElement('div', { class: 'idea-container' }, [
        createElement('div', { class: 'idea-image-container' }, [
            createElement('img', {
                class: 'idea-image',
                src: currentIdea.image,
                alt: currentIdea.name,
                onerror: "this.src='images/placeholder.jpg'"
            })
        ]),
        createElement('div', { class: 'idea-header' }, [
            createElement('h1', {}, currentIdea.name),
            createElement('div', { class: 'tech-level' }, `Tech Level: ${currentTechLevel || 'N/A'}`)
        ]),
        createElement('div', { class: 'idea-description' }, [
            createElement('p', {}, currentIdea.description)
        ])
    ]);
}

/**
 * Render recommendations for related ideas
 */
function renderRecommendations() {
    if (!elements.recommendationsContainer) return;
    
    const sameLevelIdeas = getSameLevelIdeas();
    const nextLevelIdeas = getNextLevelIdeas();
    
    if (sameLevelIdeas.length === 0 && nextLevelIdeas.length === 0) {
        elements.recommendationsContainer.style.display = 'none';
        return;
    }
    
    const recommendations = [];
    
    if (sameLevelIdeas.length > 0) {
        recommendations.push(
            createElement('h2', {}, 'Adjacent Ideas'),
            createRecommendedIdeasGrid(sameLevelIdeas)
        );
    }
    
    if (nextLevelIdeas.length > 0) {
        recommendations.push(
            createElement('h2', {}, 'Deeper Ideas'),
            createRecommendedIdeasGrid(nextLevelIdeas)
        );
    }
    
    elements.recommendationsContainer.innerHTML = '';
    elements.recommendationsContainer.appendChild(
        createElement('div', { class: 'recommendations' }, recommendations)
    );
}

/**
 * Get ideas from the same tech level
 * @returns {Array} Array of idea objects
 */
function getSameLevelIdeas() {
    if (!currentPipeline || !currentTechLevel || !currentPipeline.ideas[currentTechLevel]) {
        return [];
    }
    return currentPipeline.ideas[currentTechLevel]
        .filter(idea => idea.name !== currentIdea.name);
}

/**
 * Get ideas from the next tech level
 * @returns {Array} Array of idea objects
 */
function getNextLevelIdeas() {
    if (!currentPipeline || !currentTechLevel) return [];
    
    const nextLevel = parseInt(currentTechLevel) + 1;
    return currentPipeline.ideas[nextLevel] || [];
}

/**
 * Create a grid of recommended ideas
 * @param {Array} ideas - Array of idea objects
 * @returns {HTMLElement} The created grid element
 */
function createRecommendedIdeasGrid(ideas) {
    return createElement('div', { class: 'recommended-ideas' },
        ideas.map(idea => createRecommendedIdeaCard(idea))
    );
}

/**
 * Create a recommended idea card
 * @param {Object} idea - The idea data
 * @returns {HTMLElement} The created card element
 */
function createRecommendedIdeaCard(idea) {
    return createElement('a', {
        class: 'recommended-idea',
        href: `idea.html?pipeline=${encodeURIComponent(currentPipeline.name)}&idea=${encodeURIComponent(idea.name)}`
    }, [
        createElement('img', {
            src: idea.image,
            alt: idea.name,
            onerror: "this.src='images/placeholder.jpg'"
        }),
        createElement('span', {}, idea.name)
    ]);
}

/**
 * Render the "not found" message
 */
function renderNotFound() {
    if (!elements.ideaContent) return;
    
    elements.ideaContent.innerHTML = `
        <h1>Idea Not Found</h1>
        <p>The requested idea could not be found.</p>
    `;
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
