// create tickets upon completion and marked as paid
// loop through the orderlines and create ticket assets
import { nanoid } from "nanoid";
import { storeJsonArrayToFile } from "./utils.js";
const registerHook = ({ init, filter, action }, hookCtx) => {
  const { logger, env, database, emitter, services, exceptions, getSchema } = hookCtx;
  const { ItemsService } = services;
  //   console.log(Object.keys(services));
  const { InvalidPayloadException } = exceptions;
  //   console.log(Object.keys(exceptions));
  action("event_order.items.update", async (input, ctx) => {
    let tmp = [];
    // let payload = {
    //   status: "published",
    //   event_ticket: null,
    //   venue_name: null,
    //   venue_address: null,
    //   owner_name: null,
    //   owner_phone: null,
    //   ticket_code: "",
    //   owner_email: null,
    //   event_order: null,
    //   reference: null,
    //   qr_code: null,
    //   start_date: null,
    //   end_date: null,
    // };
    console.log(input);
    // console.log(Object.keys(ctx));
    const orderService = new ItemsService("event_order", { schema: ctx.schema });
    const orderlinesService = new ItemsService("event_orderline", { schema: ctx.schema });
    const ticketAssetService = new ItemsService("ticket_asset", { schema: ctx.schema });
    // const eventService = new ItemsService("eventz", { schema: ctx.schema });
    const event_order = await orderService.readOne(input.keys[0], { fields: ["*", "eventz.*"] });
    // const eventz = await eventService.readOne(event_order.eventz)
    const orderlines = await orderlinesService.readByQuery({
      fields: ["*", "ticket.id", "ticket.name"],
      filter: { event_order: event_order.id },
    });

    // console.log(orderlines);
    // console.log(event_order);
    const eventz = event_order.eventz;
    orderlines.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        const payload = {};
        const idx = nanoid(5);
        payload.etx = i;
        payload.event_ticket = item.ticket.id;
        payload.event_order = event_order.id;
        payload.venue_name = eventz.venue_name;
        payload.venue_address = eventz.venue_address;
        payload.owner_name = `${event_order.contact_firstname} ${event_order.contact_lastname}`;
        payload.owner_phone = event_order.contact_phone;
        payload.owner_email = event_order.contact_email;
        payload.start_date = eventz.start_date;
        payload.end_date = eventz.end_date;
        payload.venue_city = eventz.venue_city;
        payload.ticket_code = `${item.ticket.id}${i}_${idx}`;

        tmp.push(payload);
      }
    });
    // orderlines.map((item) => {
    //   payload.event_ticket = item.ticket.id;
    //   payload.event_order = event_order.id;
    //   payload.venue_name = eventz.venue_name;
    //   payload.venue_address = eventz.venue_address;
    //   payload.owner_name = `${event_order.contact_firstname} ${event_order.contact_lastname}`;
    //   payload.owner_phone = event_order.contact_phone;
    //   payload.owner_email = event_order.contact_email;
    //   payload.start_date = eventz.start_date;
    //   payload.end_date = eventz.end_date;
    //   payload.venue_city = eventz.venue_city;
    //   payload.ticket_code = `${item.ticket.id}_${nanoid(5)}`;

    //   tmp.push(payload);
    // });

    // console.log(tmp);

    // storeJsonArrayToFile(tmp);
    // storeJsonArrayToFile(orderlines, "./info.json");

    // throw new InvalidPayloadException("Testing Error....");
    // console.log(tmp);

    // create ticket asset
    if (["published"].includes(input.payload.status)) {
      await ticketAssetService.createMany(tmp);
    }
  });
};

export default registerHook;
