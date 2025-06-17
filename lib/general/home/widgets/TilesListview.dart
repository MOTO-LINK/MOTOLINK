import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/general/home/models/listtilemodel.dart';
import 'package:moto/general/home/widgets/listtile.dart';
import 'package:moto/general/map/utils/views/adresses.dart';

class tiles_list extends StatelessWidget {
  const tiles_list({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final colors = ColorsApp();
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10.0),
          child: GestureDetector(
            onTap: () {
              // ضع هنا ما تريده عند الضغط على أول تايل
            },
            child: SizedBox(
              height: 90,
              child: tiles(
                tilemodel: tilesmodel(
                  firsticon: Icon(
                    Icons.history,
                    color: colors.accentColor,
                  ),
                  secondicon: IconButton(
                    icon: Icon(Icons.arrow_forward_ios, color: colors.accentColor),
                    onPressed: () {},
                  ),
                  title: 'Recent Trips',
                  subtitle: 'View your trip history',
                ),
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10.0),
          child: GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => Adresses(),
                ),
              );
            },
            child: SizedBox(
              height: 90,
              child: tiles(
                tilemodel: tilesmodel(
                  firsticon: Icon(Icons.star, color: colors.accentColor),
                  secondicon: IconButton(
                    icon: Icon(Icons.arrow_forward_ios, color: colors.accentColor),
                    onPressed: () {},
                  ),
                  title: 'Saved Places',
                  subtitle: 'Quick access to your favourite location',
                ),
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10.0),
          child: GestureDetector(
            onTap: () {
              // ضع هنا ما تريده عند الضغط على ثالث تايل
            },
            child: SizedBox(
              height: 90,
              child: tiles(
                tilemodel: tilesmodel(
                  firsticon: Icon(Icons.wallet, color: colors.accentColor),
                  secondicon: IconButton(
                    icon: Icon(Icons.arrow_forward_ios, color: colors.accentColor),
                    onPressed: () {},
                  ),
                  title: 'Payment Method',
                  subtitle: 'Manage Your Payment Options',
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}