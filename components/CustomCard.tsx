import { Card } from "theme-ui";

export default function CustomCard({
  children,
  height = "200px",
}: {
  children: React.ReactNode;
  height?: string;
}) {
  return (
    <Card
      sx={{
        width: "100%",
        p: 3,
        bg: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "20px",
        boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.05)",
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {children}
    </Card>
  );
}
