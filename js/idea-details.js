// Import the pipelines data
import pipelines from './pipeline-data.js';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ideaName = decodeURIComponent(urlParams.get('idea'));
    const pipelineName = decodeURIComponent(urlParams.get('pipeline') || '');
    
    // Find the idea in the specified pipeline or search all pipelines
    let idea = null;
    let foundPipeline = null;
    let foundTechLevel = null;
    
    if (!ideaName) {
        console.error('No idea name provided in URL');
        window.location.href = 'index.html';
        return;
    }

    // Find the pipeline and idea
    const searchPipelines = pipelineName 
        ? [pipelines.find(p => p.name === pipelineName)] 
        : pipelines;
    
    for (const pipeline of searchPipelines) {
        if (!pipeline || !pipeline.ideas) continue;
        
        for (const [level, ideas] of Object.entries(pipeline.ideas)) {
            const foundIdea = ideas.find(i => i.name === ideaName);
            if (foundIdea) {
                idea = foundIdea;
                foundPipeline = pipeline;
                foundTechLevel = level;
                break;
            }
        }
        
        if (idea) break;
    }

    // Update back button to return to the pipeline-details page
    const backButton = document.querySelector('.back-button');
    if (foundPipeline) {
        backButton.href = `pipeline-details.html?name=${encodeURIComponent(foundPipeline.name)}`;
        backButton.textContent = `← Back to ${foundPipeline.name}`;
    } else {
        backButton.href = 'index.html';
        backButton.textContent = '← Back to Home';
    }

    if (idea) {
        const ideaContent = document.querySelector('.idea-content');
        
        // Populate main content
        ideaContent.innerHTML = `
            <div class="idea-image-container">
                <img src="${idea.image}" alt="${idea.name}" class="idea-image" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="idea-header">
                <h1>${idea.name}</h1>
                <div class="tech-level">Tech Level: ${foundTechLevel || 'N/A'}</div>
            </div>
            <div class="idea-description">
                <p>${idea.description}</p>
            </div>
        `;

        // Create recommendations HTML (simplified for now - can be enhanced later)
        const recommendationsContainer = document.querySelector('.recommendations-container');
        let recommendationsHtml = '';
        
        // Get other ideas from the same tech level
        const sameLevelIdeas = foundPipeline && foundPipeline.ideas[foundTechLevel] 
            ? foundPipeline.ideas[foundTechLevel].filter(i => i.name !== ideaName)
            : [];
            
        // Get ideas from next tech level if available
        const nextLevel = parseInt(foundTechLevel) + 1;
        const nextLevelIdeas = foundPipeline && foundPipeline.ideas[nextLevel]
            ? foundPipeline.ideas[nextLevel]
            : [];
            
        if (sameLevelIdeas.length > 0 || nextLevelIdeas.length > 0) {
            recommendationsHtml = `
                <div class="recommendations">
                    ${sameLevelIdeas.length > 0 ? `
                        <h2>Other Ideas at This Level</h2>
                        <div class="recommended-ideas">
                            ${sameLevelIdeas.map(adjacentIdea => `
                                <a href="idea-details.html?pipeline=${encodeURIComponent(foundPipeline.name)}&idea=${encodeURIComponent(adjacentIdea.name)}" class="recommended-idea">
                                    <img src="${adjacentIdea.image}" alt="${adjacentIdea.name}" onerror="this.src='images/placeholder.jpg'">
                                    <span>${adjacentIdea.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${nextLevelIdeas.length > 0 ? `
                        <h2>Next Level Ideas</h2>
                        <div class="recommended-ideas">
                            ${nextLevelIdeas.map(nextIdea => `
                                <a href="idea-details.html?pipeline=${encodeURIComponent(foundPipeline.name)}&idea=${encodeURIComponent(nextIdea.name)}" class="recommended-idea">
                                    <img src="${nextIdea.image}" alt="${nextIdea.name}" onerror="this.src='images/placeholder.jpg'">
                                    <span>${nextIdea.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>`;
            recommendationsContainer.innerHTML = recommendationsHtml;
        }
        document.title = `Tech Tree - ${idea.name}`;
    } else {
        const ideaContent = document.querySelector('.idea-content');
        ideaContent.innerHTML = `
            <h1>Idea Not Found</h1>
            <p>The requested idea could not be found.</p>
        `;
    }
});
