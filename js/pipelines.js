// Import the pipelines data
import pipelines from './pipeline-data.js';

// Wait for the DOM to be fully loaded before running the script
function initPipelines() {
    console.log('Initializing pipelines...');
    
    // Get the container where we'll add the pipeline cards
    const pipelinesContainer = document.getElementById('pipelines');
    const pipelinesGrid = document.querySelector('.pipelines-grid');
    
    if (!pipelinesContainer || !pipelinesGrid) {
        console.error('Error: Could not find required elements');
        // Try again in case elements haven't loaded yet
        setTimeout(initPipelines, 100);
        return;
    }
    
    console.log('Found containers');
    
    // Clear any existing content in the grid
    pipelinesGrid.innerHTML = '';
    
    // Verify we have valid pipelines data
    if (!Array.isArray(pipelines) || pipelines.length === 0) {
        console.error('No pipelines data found');
        pipelinesContainer.textContent = 'No pipelines available.';
        return;
    }
    
    console.log('Found', pipelines.length, 'pipelines');
    
    // Create a card for each pipeline
    pipelines.forEach((pipeline, index) => {
        console.log(`Creating card ${index + 1}/${pipelines.length}:`, pipeline.name);
        
        try {
            // Create card container (as a link)
            const cardLink = document.createElement('a');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            cardLink.href = `pipeline-details.html?name=${encodeURIComponent(pipeline.name)}&from=${encodeURIComponent(currentPage)}`;
            cardLink.className = 'pipeline-card';
            // Styles are handled by CSS
            
            // Create and add the image if it exists
            if (pipeline.image) {
                const img = document.createElement('img');
                img.src = pipeline.image;
                img.alt = `${pipeline.name} image`;
                img.className = 'pipeline-image';
                cardLink.appendChild(img);
            }
            
            // Create and set the title
            const title = document.createElement('h2');
            title.textContent = pipeline.name;
            title.style.cssText = 'color: var(--primary-color); margin: 0.5rem 0;';
            cardLink.appendChild(title);
            
            // Add card to grid container
            pipelinesGrid.appendChild(cardLink);
            
            console.log(`Card created for: ${pipeline.name}`);
        } catch (error) {
            console.error(`Error creating card for ${pipeline.name}:`, error);
        }
    });
}

// Start the initialization when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPipelines);
} else {
    // In case the document is already loaded
    initPipelines();
}
