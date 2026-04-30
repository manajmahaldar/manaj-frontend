const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));

const audits = data.audits;
const categories = data.categories;

console.log("=== Performance Metrics ===");
console.log(`Performance Score: ${categories.performance.score * 100}`);
console.log(`First Contentful Paint (FCP): ${audits['first-contentful-paint'].displayValue}`);
console.log(`Largest Contentful Paint (LCP): ${audits['largest-contentful-paint'].displayValue}`);
console.log(`Total Blocking Time (TBT): ${audits['total-blocking-time'].displayValue}`);
console.log(`Cumulative Layout Shift (CLS): ${audits['cumulative-layout-shift'].displayValue}`);
console.log(`Speed Index: ${audits['speed-index'].displayValue}`);

console.log("\n=== Largest Network Requests ===");
const networkRequests = audits['network-requests'].details.items;
// Sort by resource size descending
networkRequests.sort((a, b) => b.resourceSize - a.resourceSize);
const topRequests = networkRequests.slice(0, 10);
topRequests.forEach((req, index) => {
    const sizeKB = (req.resourceSize / 1024).toFixed(2);
    console.log(`${index + 1}. ${req.url} (${req.mimeType}) - ${sizeKB} KB`);
});

console.log("\n=== Opportunities (Optimizations) ===");
const opportunities = [
    'modern-image-formats',
    'uses-optimized-images',
    'uses-text-compression',
    'uses-responsive-images',
    'unminified-css',
    'unminified-javascript',
    'unused-javascript',
    'unused-css-rules',
    'render-blocking-resources'
];

opportunities.forEach(id => {
    if (audits[id] && audits[id].score !== null && audits[id].score < 1) {
        console.log(`- ${audits[id].title}: ${audits[id].displayValue || 'Potential savings'}`);
    }
});

console.log("\n=== Diagnostics ===");
const diagnostics = [
    'total-byte-weight',
    'dom-size'
];

diagnostics.forEach(id => {
    if (audits[id]) {
        console.log(`- ${audits[id].title}: ${audits[id].displayValue}`);
    }
});
