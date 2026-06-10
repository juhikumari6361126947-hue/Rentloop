import { Check, MapPin, Phone, MapPinIcon, X } from "lucide-react";
import ItemImage from "./ItemImage";
import LocationMap from "./LocationMap";

export default function RequestList({ requests, incoming = true, onUpdate }) {
  const userDetails = (phone, address, label) => (
    <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm space-y-2">
      <p className="font-semibold text-slate-700">{label}</p>
      {phone ? (
        <p className="flex items-center gap-2">
          <Phone size={14} className="text-teal" />
          <span>{phone}</span>
        </p>
      ) : null}
      {address ? (
        <p className="flex items-center gap-2">
          <MapPinIcon size={14} className="text-teal" />
          <span>{address}</span>
        </p>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request._id} className="panel p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <ItemImage
                  src={request.itemId?.imageUrl}
                  alt={request.itemId?.title}
                  className="h-14 w-14 rounded-md object-cover"
                />
                <div>
                  <p className="font-semibold">{request.itemId?.title}</p>
                  <p className="text-sm text-slate-600">
                    {incoming
                      ? `Requested by ${request.requesterId?.name}`
                      : `Owner: ${request.ownerId?.name}`}
                  </p>
                  {request.duration ? (
                    <p className="mt-1 text-sm font-semibold text-teal">
                      Duration: {request.duration} day{request.duration > 1 ? 's' : ''} | Total: ₹{request.totalPrice}
                    </p>
                  ) : null}
                  {request.message ? (
                    <p className="mt-1 text-sm text-slate-500">{request.message}</p>
                  ) : null}
                  {request.deliveryLocation ? (
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin size={14} /> Deliver to {request.deliveryLocation}
                    </p>
                  ) : null}
                </div>
              </div>
              {incoming
                ? userDetails(request.requesterPhone || request.requesterId?.phone, request.requesterId?.address, "Customer Details")
                : null}
              {!incoming
                ? userDetails(
                    request.ownerPhone || request.ownerId?.phone || request.itemId?.phone,
                    request.ownerId?.address,
                    "Owner Details"
                  )
                : null}
            </div>
            <div className="flex flex-col gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-center">
                {request.status}
              </span>
              {incoming && request.status === "Pending" ? (
                <>
                  <button className="btn-primary px-3 py-2 text-sm" onClick={() => onUpdate(request._id, "Accepted")}>
                    <Check size={14} /> Accept
                  </button>
                  <button className="btn-danger px-3 py-2 text-sm" onClick={() => onUpdate(request._id, "Rejected")}>
                    <X size={14} /> Reject
                  </button>
                </>
              ) : null}
            </div>
          </div>
          {request.deliveryLat && request.deliveryLng ? (
            <LocationMap
              className="mt-4"
              pickup={{
                lat: request.itemId?.pickupLat,
                lng: request.itemId?.pickupLng,
                label: request.itemId?.location
              }}
              delivery={{
                lat: request.deliveryLat,
                lng: request.deliveryLng,
                label: request.deliveryLocation
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
