echo "POST http://localhost:3000/" | \
vegeta attack -duration=5m -rate 20 -targets ./request | \
tee ./results/results.bin | \
vegeta report


vegeta report -type=json ./results/results.bin > ./results/metrics.json
cat ./results/results.bin | vegeta plot > ./results/plot.html
cat ./results/results.bin | vegeta report -type='hist[100ms,200ms,300ms,400ms,500ms,600ms,700ms]'