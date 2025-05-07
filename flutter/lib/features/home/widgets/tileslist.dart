import 'package:flutter/material.dart';
import 'package:motolink/core/utils/colors_palette.dart';
import 'package:motolink/features/home/models/listtilemodel.dart';
import 'package:motolink/features/home/widgets/listtile.dart';

class tiles_list extends StatelessWidget {
  const tiles_list({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        tiles(
            tilemodel: tilesmodel(
                firsticon: Icon(
                  Icons.history,
                  color: ColorsApp.icon,
                ),
                secondicon: IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.arrow_forward_ios)),
                title: 'Recent Trips',
                subtitle: 'View your trip history')),
        tiles(
            tilemodel: tilesmodel(
                firsticon: const Icon(Icons.star),
                secondicon: IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.arrow_forward_ios)),
                title: 'Saved Places',
                subtitle: 'Quick access to your favourite location')),
        tiles(
            tilemodel: tilesmodel(
                firsticon: const Icon(Icons.wallet),
                secondicon: IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.arrow_forward_ios)),
                title: 'Payment Method',
                subtitle: 'Mange Your Payement Options'))
      ],
    );
  }
}
