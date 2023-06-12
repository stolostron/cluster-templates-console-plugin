import { Meta, StoryObj } from '@storybook/react';
import ResourceStatus, { Status } from './ResourceStatus';

const meta: Meta<typeof ResourceStatus> = {
  title: 'ResourceStatus',
  component: ResourceStatus,
};

export default meta;
type Story = StoryObj<typeof ResourceStatus>;

export const LongMessage: Story = {
  args: {
    message: `Apple pie is the pinnacle of classic American desserts, and everyone needs a staple recipe up their sleeve. If you’ve been searching for one that delivers a flaky, buttery crust and a perfectly sweet-tart apple filling, we’re here to tell you—this is it. Our classic apple pie not only delivers on that iconic presentation and signature flavor, but is surprisingly easy to make homemade (even that crust!). Follow our top tips down below to make this iconic recipe your new holiday go-to: The best apples for apple pie (& how to avoid a watery pie)`,
    status: Status.Failed,
    statusLabel: 'Apple pie',
    errorInstructions: `Our favorite apples for apple pie: Granny Smith, Honeycrisp, and Gala. Feel free to mix it up! We like using a mix for the ultimate apple pie—pick a few to find your ultimate combo. These apples not only taste deliver on that ideal sweet & tart flavor, but have a high amount of pectin. We add a little flour to help thicken our pie mixture, but choosing a high-pectin apple like our faves here also aids in creating that perfect jammy consistency.
    
    The perfect homemade pie crust (& how to avoid a soggy bottom).
    Our basic pie crust in this recipe is just the right amount of flaky and—most importantly—easy to work with. It holds up beautifully when baking with our filling, but if you’re worried about a soggy bottom, you can blind bake for peace of mind. Simply lay down some parchment, pile with pie weights or dry beans, and bake until the crust is just lightly golden. Fill your pie and follow the rest of the recipe as written. 
    
    Tip: Make your dough ahead of time! Pie dough keeps well in the refrigerator for up to 2 days and in the freezer for a couple of months. Just make sure to wrap it well with plastic wrap.
    
    Storage.
    While pie doesn’t last long in the Delish kitchens, we understand leftovers happen. Opt for storing the pie at room temperature (wrapped tightly in plastic wrap or in an airtight container) for around 3 days. If you need to store for any longer, wrap tightly in plastic wrap or in an airtight container and keep in the fridge for up to 5 days. Looking to freeze? Wrap tightly in plastic or place in an airtight freezer safe container and freeze for up to 3 months. Thaw completely at room temperature for 1 to 2 hours before reheating and serving.
    
    Made this classic recipe? Let us know how it went in the comments below!`,
  },
};
