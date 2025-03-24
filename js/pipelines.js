import pipelines from './pipeline-data.js';

document.addEventListener('DOMContentLoaded', () => {
    const pipelineGrid = document.querySelector('.pipeline-grid');

    // Create title section independently
    const titleSection = document.createElement('div');
    titleSection.className = 'title-section';
    titleSection.innerHTML = `
        <h2>Pipelines</h2>
        <p class="tech-description">Explore various pipelines and their associated ideas.</p>
    `;
    const mainElement = document.querySelector('main');
    mainElement.insertBefore(titleSection, pipelineGrid);

    // Display pipelines
    if (pipelines.length > 0) {
        pipelines.forEach(pipeline => {
            const pipelineCard = document.createElement('div');
            pipelineCard.className = 'pipeline-card';
            pipelineCard.innerHTML = `
                <img src="${pipeline.image}" alt="${pipeline.name}" onerror="this.src='images/placeholder.jpg'">
                <h3>${pipeline.name}</h3>
            `;
            pipelineGrid.appendChild(pipelineCard);
        });
    } else {
        const message = document.createElement('p');
        message.textContent = 'No pipelines available yet.';
        message.style.textAlign = 'center';
        message.style.color = 'var(--text-color)';
        pipelineGrid.appendChild(message);
    }
});
