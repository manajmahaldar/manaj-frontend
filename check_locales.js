const fs = require('fs');

['hi.json','bn.json','or.json'].forEach(f => {
    const content = fs.readFileSync('./src/locales/' + f, 'utf8');
    const start = content.indexOf('"policeStations"');
    const block = content.slice(start);
    const end = block.indexOf('\n  },');
    const psBlock = block.slice(0, end);
    
    // Extract all keys inside policeStations
    const matches = [];
    const re = /"([^"]+)"\s*:/g;
    let m;
    while ((m = re.exec(psBlock)) !== null) {
        if (m[1] !== 'policeStations') matches.push(m[1]);
    }
    
    const dupes = matches.filter((k,i) => matches.indexOf(k) !== i);
    const uniqueDupes = [...new Set(dupes)];
    
    if (uniqueDupes.length) {
        console.log(f + ' policeStations DUPLICATE KEYS (' + uniqueDupes.length + '):', uniqueDupes.slice(0,20).join(', '));
    } else {
        console.log(f + ' policeStations: OK - ' + matches.length + ' entries');
    }
});
