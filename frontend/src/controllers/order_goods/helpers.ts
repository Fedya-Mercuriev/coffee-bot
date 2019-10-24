import { Good } from 'good';
import { GoodVolume } from 'good-volume';

/*{
  "url": "http://142.93.195.42:8000/api/good_volumes/17/",
  "price": "200.00",
  "goodvolume_id": 17,
  "good": 1,
  "volume": 1,
  "units": "300"
}*/

export default function navigationAdder(
  button: Good,
  goodVolumes: GoodVolume[],
  scenes: string[]
) {
  const resultArr = goodVolumes.filter(item => item.good === button.good_id);
  if (resultArr.length) {
    return Object.assign(button, { scene: scenes[0] });
  } else {
    return Object.assign(button, { scene: scenes[1] });
  }
}
