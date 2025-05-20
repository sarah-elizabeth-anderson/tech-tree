// Import the pipelines data
import pipelines from './pipeline-data.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const pipelineName = urlParams.get('name');
    const fromPage = urlParams.get('from') || 'index.html';
    
    // Add back button functionality
    const backButton = document.createElement('a');
    backButton.href = fromPage;
    backButton.className = 'back-button';
    backButton.innerHTML = '← Back';
    document.querySelector('main').insertBefore(backButton, document.querySelector('main').firstChild);
    
    if (!pipelineName) {
        console.error('No pipeline name provided in URL');
        window.location.href = 'pipelines.html';
        return;
    }
    
    // Find the pipeline in our data
    const pipeline = pipelines.find(p => p.name === pipelineName);
    
    if (!pipeline) {
        console.error('Pipeline not found:', pipelineName);
        window.location.href = 'pipelines.html';
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
    
    // Add the ideas list
    const ideasList = document.getElementById('pipeline-ideas');
    if (pipeline.ideas && pipeline.ideas.length > 0) {
        pipeline.ideas.forEach(idea => {
            const li = document.createElement('li');
            li.className = 'idea-item';
            
            // Create a link to the idea details page
            const ideaLink = document.createElement('a');
            ideaLink.href = `idea-details.html?idea=${encodeURIComponent(idea)}`;
            ideaLink.textContent = idea;
            
            // Add the link to the list item
            li.appendChild(ideaLink);
            ideasList.appendChild(li);
        });
    } else {
        const noIdeas = document.createElement('p');
        noIdeas.textContent = 'No ideas available for this pipeline.';
        ideasList.appendChild(noIdeas);
    }
});
