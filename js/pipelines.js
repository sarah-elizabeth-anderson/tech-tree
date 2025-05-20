// Import the pipelines data
import pipelines from './pipeline-data.js';

// Wait for the DOM to be fully loaded before running the script
function initPipelines() {
    console.log('Initializing pipelines...');
    
    // Get the container where we'll add the pipeline cards
    const pipelinesContainer = document.getElementById('pipelines');
    
    if (!pipelinesContainer) {
        console.error('Error: Could not find element with ID "pipelines"');
        // Try again in case the element hasn't loaded yet
        setTimeout(initPipelines, 100);
        return;
    }
    
    console.log('Found pipelines container');
    
    // Clear any existing content
    pipelinesContainer.innerHTML = '';
    
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
            cardLink.style.display = 'block';
            cardLink.style.textDecoration = 'none';
            cardLink.style.color = 'inherit';
            
            // Set card styles
            Object.assign(cardLink.style, {
                backgroundColor: 'var(--background-color)',
                border: '2px solid var(--gradient-color)',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '600px',
                margin: '0 auto 1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            });
            
            // Create and add the image if it exists
            if (pipeline.image) {
                const img = document.createElement('img');
                img.src = pipeline.image;
                img.alt = `${pipeline.name} image`;
                img.style.cssText = 'width: 100%; max-height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 1rem;';
                cardLink.appendChild(img);
            }
            
            // Create and set the title
            const title = document.createElement('h2');
            title.textContent = pipeline.name;
            title.style.cssText = 'color: var(--primary-color); margin: 0.5rem 0;';
            cardLink.appendChild(title);
            
            // Add card to container
            pipelinesContainer.appendChild(cardLink);
            
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
