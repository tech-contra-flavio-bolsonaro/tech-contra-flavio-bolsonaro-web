import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import ManifestoPage from "./page";
afterEach(cleanup);
it("renders the complete authoritative manifesto and an accessible signature destination",()=>{
 render(<ManifestoPage />);
 for(const name of ["VIRAR É FAZER JUNTO.","IDEIA BOA NÃO FICA PARADA.","NINGUÉM VIRA O JOGO SOZINHO.","COMO QUEREMOS FAZER.","CLAREZA","AFETO","CORAGEM"]) expect(screen.getByRole("heading",{name})).toBeInTheDocument();
 expect(screen.getByRole("link",{name:/Assinar o manifesto/})).toHaveAttribute("href","#assinar-manifesto");
 expect(screen.getByRole("form",{name:/Assinatura do manifesto/})).toHaveAttribute("novalidate");
 expect(screen.getByRole("checkbox")).not.toBeChecked();
});
