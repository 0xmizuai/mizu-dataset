/** @jsxImportSource theme-ui */
import { Box, Flex, Input, Image } from "theme-ui";

function Header() {
  return (
    <Flex
      sx={{
        justifyContent: "space-between",
        p: 3,
        borderBottom: "1px solid #eaeaea",
        width: 1280,
        maxWidth: "100%",
      }}
    >
      <Image src="/images/login/logo-text.png" sx={{ maxWidth: "114px" }} />
      <Flex sx={{ alignItems: "center" }}>
        <Input
          placeholder="Search Dataset..."
          sx={{
            maxWidth: ["100%", "300px"],
            ml: [0, 3],
            flex: 1,
          }}
          icon={
            <Image
              src="/images/icons/search.png"
              width="24px"
              height="24px"
              sx={{ position: "absolute", right: 10, top: "50%" }}
            />
          }
        />
        <Box sx={{ ml: 3 }}>
          <Image
            src="/images/icons/avatar.png"
            sx={{ width: "24px", height: "24px" }}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

export default Header;
