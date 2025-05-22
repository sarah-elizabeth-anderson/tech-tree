// Import the pipelines data
import pipelines from './pipeline-data.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const pipelineName = urlParams.get('name');
    const fromPage = urlParams.get('from') || 'index.html';
    
    if (!pipelineName) {
        console.error('No pipeline name provided in URL');
        window.location.href = 'index.html';
        return;
    }
    
    // Find the pipeline in our data
    const pipeline = pipelines.find(p => p.name === pipelineName);
    
    if (!pipeline) {
        console.error('Pipeline not found:', pipelineName);
        window.location.href = 'index.html';
        return;
    }
    
    // Update the page with pipeline data
    document.title = `Tech Tree - ${pipeline.name}`;
    document.getElementById('pipeline-title').textContent = pipeline.name;
    
    // Set the image if it exists
    const pipelineImage = document.getElementById('pipeline-image');
    if (pipeline.image) {
        pipelineImage.src = pipeline.image;
        pipelineImage.alt = `${pipeline.name} image`;
    } else {
        pipelineImage.style.display = 'none';
    }
    
    // Get the container for the ideas
    const pipelineContent = document.querySelector('.pipeline-content');
    pipelineContent.innerHTML = ''; // Clear existing content
    
    // Create a section for each tech level
    Object.entries(pipeline.ideas).forEach(([techLevel, ideas]) => {
        if (!ideas || ideas.length === 0) return;
        
        // Create section for this tech level
        const section = document.createElement('div');
        section.className = 'tech-level-section';
        
        // Add tech level header
        const header = document.createElement('h2');
        header.textContent = `Tech Level ${techLevel}`;
        section.appendChild(header);
        
        // Create grid for idea cards
        const grid = document.createElement('div');
        grid.className = 'ideas-grid';
        
        // Add each idea as a card
        ideas.forEach(idea => {
            const card = document.createElement('a');
            card.className = 'idea-card';
            // Include both pipeline name and idea name in the URL
            card.href = `idea-details.html?pipeline=${encodeURIComponent(pipeline.name)}&idea=${encodeURIComponent(idea.name)}`;
            
            // Add image if available
            if (idea.image) {
                const img = document.createElement('img');
                img.src = idea.image;
                img.alt = idea.name;
                img.className = 'idea-image';
                card.appendChild(img);
            }
            
            // Add idea name
            const name = document.createElement('h3');
            name.textContent = idea.name;
            card.appendChild(name);
            
            // Add description if available
            if (idea.description) {
                const desc = document.createElement('p');
                desc.textContent = idea.description;
                desc.className = 'idea-description';
                card.appendChild(desc);
            }
            
            grid.appendChild(card);
        });
        
        section.appendChild(grid);
        pipelineContent.appendChild(section);
    });
    
    // If no ideas found, show message
    if (pipelineContent.children.length === 0) {
        const noIdeas = document.createElement('p');
        noIdeas.textContent = 'No ideas available for this pipeline.';
        pipelineContent.appendChild(noIdeas);
    }
});
