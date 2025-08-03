#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Démarrage des tests unitaires pour tous les composants...\n');

// Liste des fichiers de test à exécuter
const testFiles = [
  'test/components/VolunteerAnnouncementCard.test.ts',
  'test/components/NoConnectedAnnouncementCard.test.ts',
  'test/components/Header.test.ts',
  'test/components/CookieConsent.test.ts',
  'test/components/MultiMarkerMap.test.ts',
  'test/components/Login.test.ts',
  'test/components/VolunteerEventFilters.test.ts'
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

// Fonction pour exécuter un test
function runTest(testFile) {
  try {
    console.log(`📋 Test: ${testFile}`);
    
    const result = execSync(`npx vitest run ${testFile} --reporter=verbose`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ Succès\n');
    passedTests++;
    results.push({ file: testFile, status: 'PASS', output: result });
    return true;
  } catch (error) {
    console.log('❌ Échec\n');
    failedTests++;
    results.push({ file: testFile, status: 'FAIL', output: error.stdout || error.message });
    return false;
  }
}

// Exécuter tous les tests
console.log('🚀 Exécution des tests...\n');

testFiles.forEach(testFile => {
  if (fs.existsSync(testFile)) {
    runTest(testFile);
    totalTests++;
  } else {
    console.log(`⚠️  Fichier de test non trouvé: ${testFile}\n`);
  }
});

// Générer le rapport
console.log('\n📊 RAPPORT DES TESTS\n');
console.log('='.repeat(50));
console.log(`Tests totaux: ${totalTests}`);
console.log(`Tests réussis: ${passedTests}`);
console.log(`Tests échoués: ${failedTests}`);
console.log(`Taux de réussite: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

// Afficher les détails des échecs
if (failedTests > 0) {
  console.log('\n❌ DÉTAILS DES ÉCHECS:');
  console.log('='.repeat(50));
  results.filter(r => r.status === 'FAIL').forEach(result => {
    console.log(`\n📁 ${result.file}:`);
    console.log(result.output);
  });
}

// Générer un fichier de rapport JSON
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    successRate: ((passedTests / totalTests) * 100).toFixed(2)
  },
  results: results
};

fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Rapport détaillé sauvegardé dans: test-report.json');

// Statut de sortie
if (failedTests > 0) {
  console.log('\n❌ Certains tests ont échoué!');
  process.exit(1);
} else {
  console.log('\n✅ Tous les tests sont passés!');
  process.exit(0);
} 