import curry from "../curry";

function delay(func, wait) {
  console.log(`delay`, { func, wait });
  return function execute(target) {
    setTimeout(() => {
      func(target);
    }, wait);
    console.log(`delay-execute`, { func, wait, target });

    return target;
  };
}

export default curry(delay);
