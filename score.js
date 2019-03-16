const outputs = [];
const predictionPoint = 300;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

  // let numberCorrect = 0;

  // for (let i = 0; i < testSet.length; i++) {
  //   const bucket = knn(trainingSet, testSet[i][0]);
  //   if (bucket === testSet[i][3]) {
  //     numberCorrect++;
  //   }
  // }

  // console.log(`Percentage correct: ${numberCorrect / testSetSize}`);
  _.range(1, 30).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(
        testObservation =>
          knn(trainingSet, testObservation[0], k) === testObservation[3]
      )
      .size()
      .divide(testSetSize)
      .value();

    console.log(`Accuracy for k of ${k} is ${accuracy}`);
  });
}

function knn(data, point, k) {
  return _.chain(data)
    .map(row => [distance(row[0], point), row[3]])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
