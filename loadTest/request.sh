echo "POST http://localhost:3000/" | \
vegeta attack -duration=5m -rate 20 -targets ./request | \
tee results.bin | \
vegeta report


vegeta report -type=json results.bin > metrics.json
cat results.bin | vegeta plot > plot.html
cat results.bin | vegeta report -type='hist[0,2ms,4ms,6ms]'